import {structureTool} from 'sanity/structure'

import {MdPostAdd, MdSettings} from 'react-icons/md'

const hiddenDocTypes = (listItem) => !['metadata', 'post'].includes(listItem.getId())

export const deskStructure = structureTool({
  structure: (S) =>
    S.list()
      .title('Content')
      .items([
        S.listItem()
          .title('Site Settings')
          .icon(MdSettings)
          .child(
            S.editor()
              .id('metadata')
              .schemaType('metadata')
              .documentId('metadata')
              .title('Default Site Metadata'),
          ),
        S.listItem()
          .title('Posts')
          .icon(MdPostAdd)
          .schemaType('post')
          .child(S.documentTypeList('post').title('Posts')),
        // Dynamically add other document types
        ...S.documentTypeListItems().filter(hiddenDocTypes),
      ]),
})
