// import type { CollectionConfig } from 'payload'

// export const Media: CollectionConfig = {
//   slug: 'media',
//   access: {
//     read: () => true,
//   },
//   fields: [
//     {
//       name: 'alt',
//       type: 'text',
//       required: true,
//     },
//   ],
//   upload: true,
// }

import { CollectionConfig } from 'payload'
import { uploadToCloudinary, cloudinary } from '../utils/cloudinary'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    adminThumbnail: ({ doc }) => {
      return (doc as any).cloudinary_url || null
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
    },
    {
      name: 'cloudinary_url',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Cloudinary URL - use this in your frontend',
      },
    },
    {
      name: 'public_id',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        // Set required fields before validation
        if (operation === 'create' && req.file) {
          // Generate unique filename by adding timestamp if needed
          let filename = req.file.name

          // Check if filename already exists
          const existing = await req.payload.find({
            collection: 'media',
            where: {
              filename: {
                equals: filename,
              },
            },
            limit: 1,
          })

          // If exists, make it unique with timestamp
          if (existing.docs.length > 0) {
            const timestamp = Date.now()
            const nameParts = filename.split('.')
            const ext = nameParts.pop()
            const baseName = nameParts.join('.')
            filename = `${baseName}-${timestamp}.${ext}`
          }

          data.filename = filename
          data.mimeType = req.file.mimetype
          data.filesize = req.file.size
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.file && req.file.data) {
          try {
            console.log('🔄 Uploading to Cloudinary:', data.filename)

            const result = await uploadToCloudinary(
              req.file.data,
              req.file.mimetype,
              data.filename, // Use the unique filename from beforeValidate
            )

            console.log('✅ Upload successful:', result.secure_url)

            data.cloudinary_url = result.secure_url
            data.public_id = result.public_id
            data.url = result.secure_url

            if (result.width) data.width = result.width
            if (result.height) data.height = result.height
          } catch (error) {
            console.error('❌ Upload failed:', error)
            throw new Error(`Cloudinary upload failed: ${error.message}`)
          }
        }

        return data
      },
    ],
    afterRead: [
      async ({ doc }) => {
        if (doc.cloudinary_url) {
          doc.url = doc.cloudinary_url
          doc.thumbnailURL = doc.cloudinary_url
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        if (doc.public_id) {
          try {
            await cloudinary.uploader.destroy(doc.public_id)
            console.log('🗑️ Deleted from Cloudinary:', doc.public_id)
          } catch (error) {
            console.error('❌ Delete error:', error)
          }
        }
      },
    ],
  },
}