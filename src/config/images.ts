// Central registry of every photograph. Filenames match IMAGE_ASSETS.md.
export type ImageSpec = { file: string; alt: string; ratio: string; description: string };

const img = (file: string, alt: string, ratio: string, description: string): ImageSpec => ({ file, alt, ratio, description });

export const images = {
  heroMain: img("hero/fobbs-hero-main.jpg", "FOBBS interior", "16/9", "Best room or lobby interior, empty space on the left for text. 2400x1350"),
  heroSecondary: img("hero/fobbs-hero-secondary.jpg", "Guest experience at FOBBS", "16/9", "Welcoming scene: lounge, breakfast or entrance. 2400x1350"),
  bannerAccommodation: img("hero/page-banner-accommodation.jpg", "Accommodation at FOBBS", "21/9", "Corridor, room or apartment. 2400x1030"),
  bannerAbout: img("hero/page-banner-about.jpg", "About FOBBS", "21/9", "Building or interior. 2400x1030"),
  bannerContact: img("hero/page-banner-contact.jpg", "Contact FOBBS", "21/9", "Reception or entrance. 2400x1030"),
  bannerGallery: img("hero/page-banner-gallery.jpg", "FOBBS photo gallery", "21/9", "Best interior or exterior shot. 2400x1030"),
  exterior: img("facilities/fobbs-exterior.jpg", "FOBBS building exterior", "4/5", "Building front, daytime. 1600x2000"),
  reception: img("facilities/fobbs-reception.jpg", "FOBBS reception", "4/5", "Reception desk. 1600x2000"),
  lounge: img("facilities/fobbs-lounge.jpg", "FOBBS lounge", "4/5", "Lounge or common area, if it exists. 1600x2000"),
  dining: img("facilities/fobbs-dining.jpg", "FOBBS dining area", "4/5", "Dining area, if it exists. 1600x2000"),
  apartmentLiving: img("apartments/apartment-living-room.jpg", "Apartment living room", "3/2", "Living room, wide. 2000x1333"),
  apartmentBedroom: img("apartments/apartment-bedroom.jpg", "Apartment bedroom", "4/5", "Bedroom, portrait. 1600x2000"),
  apartmentKitchen: img("apartments/apartment-kitchen.jpg", "Apartment kitchen", "1/1", "Kitchen area, only if it exists. 1600x1600"),
  apartmentDetail: img("apartments/apartment-detail.jpg", "Apartment interior detail", "16/9", "Workspace, balcony or decor detail. 2000x1125"),
  parking: img("facilities/fobbs-parking.jpg", "FOBBS parking and security", "4/5", "Parking or security, if it exists. 1600x2000"),
} satisfies Record<string, ImageSpec>;

export type ImageKey = keyof typeof images;

export const imageFor = (file: string, alt: string, ratio = "4/3", description = ""): ImageSpec => img(file, alt, ratio, description || alt);