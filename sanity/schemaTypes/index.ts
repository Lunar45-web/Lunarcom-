import { type SchemaTypeDefinition } from 'sanity'
import business from './business'
import service from './service'
import about from './about'
import faq from './faq'
import review from './review'
import gallery from './gallery'   // 👈 new import

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [business, about, service, faq, review, gallery], // 👈 added
}