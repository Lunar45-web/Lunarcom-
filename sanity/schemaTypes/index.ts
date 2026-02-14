import { type SchemaTypeDefinition } from 'sanity'
import business from './business'
import service from './service'
import faq from './faq'
import testimonial from './testimonial'
import gallery from './gallery'   // 👈 new import

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [business, service, faq, testimonial, gallery], // 👈 added
}