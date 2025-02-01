import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin, fields } from '@payloadcms/plugin-form-builder'
import { Plugin } from 'payload'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const plugins: Plugin[] = [
  formBuilderPlugin({
    fields: {
      payment: false,
      upload: true,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return [
          ...defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          }),
        ]
      },
    },
  }),
  payloadCloudPlugin(),
]
