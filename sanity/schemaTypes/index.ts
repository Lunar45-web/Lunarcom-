import { type SchemaTypeDefinition } from 'sanity'
import business from './salon'
import service from './service'
import about from './about'
import faq from './faq'
import review from './review'
import gallery from './gallery'   // 👈 new import
import salon from './salon'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [salon, about, service, faq, review, gallery], // 👈 added
}