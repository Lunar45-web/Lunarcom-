import type { StructureResolver } from 'sanity/structure'
import { Store, Scissors, ImageIcon, MessageSquare, HelpCircle, Info } from 'lucide-react'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Multi-Salon Manager')
    .items([
      S.listItem()
        .title('Salons & Clients')
        .icon(Store)
        .child(
          S.documentTypeList('salon')
            .title('Select a Salon')
            .child((salonId) =>
              S.list()
                .title('Salon Dashboard')
                .items([
                  // 1. General Settings
                  S.listItem()
                    .title('Salon Settings')
                    .icon(Store)
                    .child(S.document().schemaType('salon').documentId(salonId)),
                  
                  // 2. Services linked to this salon
                  S.listItem()
                    .title('Services')
                    .icon(Scissors)
                    .child(
                      S.documentList()
                        .title('Services')
                        .filter('_type == "service" && salon._ref == $salonId')
                        .params({ salonId })
                    ),

                  // 3. About Section linked to this salon
                  S.listItem()
                    .title('About Section')
                    .icon(Info)
                    .child(
                      S.documentList()
                        .title('About Section')
                        .filter('_type == "about" && salon._ref == $salonId')
                        .params({ salonId })
                    ),

                  // 4. Gallery linked to this salon
                  S.listItem()
                    .title('Gallery / Lookbook')
                    .icon(ImageIcon)
                    .child(
                      S.documentList()
                        .title('Gallery')
                        .filter('_type == "gallery" && salon._ref == $salonId')
                        .params({ salonId })
                    ),

                  // 5. Reviews linked to this salon
                  S.listItem()
                    .title('Customer Reviews')
                    .icon(MessageSquare)
                    .child(
                      S.documentList()
                        .title('Reviews')
                        .filter('_type == "review" && salon._ref == $salonId')
                        .params({ salonId })
                    ),

                  // 6. FAQs linked to this salon
                  S.listItem()
                    .title('FAQs')
                    .icon(HelpCircle)
                    .child(
                      S.documentList()
                        .title('FAQs')
                        .filter('_type == "faq" && salon._ref == $salonId')
                        .params({ salonId })
                    ),
                ])
            )
        ),

      // Hide the default raw lists from the main menu, so users only see them inside a Salon folder
      ...S.documentTypeListItems().filter(
        (listItem) => !['salon', 'service', 'gallery', 'review', 'faq', 'about'].includes(listItem.getId() as string)
      ),
    ])