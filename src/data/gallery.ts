// Gallery photos. Filenames match IMAGE_ASSETS.md. Only include photos of things that really exist.
export type GalleryCategory = "Rooms" | "Apartments" | "Facilities" | "Exterior";
export interface GalleryItem { id: string; file: string; label: string; category: GalleryCategory; ratio: string; size: string }

export const galleryCategories: GalleryCategory[] = ["Rooms", "Apartments", "Facilities", "Exterior"];

export const gallery: GalleryItem[] = [
  { id: "g01", file: "gallery/gallery-01.jpg", label: "Bedroom", category: "Rooms", ratio: "3/4", size: "1500x2000" },
  { id: "g02", file: "gallery/gallery-02.jpg", label: "Apartment interior", category: "Apartments", ratio: "3/2", size: "2000x1333" },
  { id: "g03", file: "gallery/gallery-03.jpg", label: "Building exterior", category: "Exterior", ratio: "1/1", size: "1600x1600" },
  { id: "g04", file: "gallery/gallery-04.jpg", label: "Reception", category: "Facilities", ratio: "1/1", size: "1600x1600" },
  { id: "g05", file: "gallery/gallery-05.jpg", label: "Lounge", category: "Facilities", ratio: "3/4", size: "1500x2000" },
  { id: "g06", file: "gallery/gallery-06.jpg", label: "Bathroom", category: "Rooms", ratio: "1/1", size: "1600x1600" },
  { id: "g07", file: "gallery/gallery-07.jpg", label: "Dining", category: "Facilities", ratio: "3/2", size: "2000x1333" },
  { id: "g08", file: "gallery/gallery-08.jpg", label: "Common area", category: "Facilities", ratio: "1/1", size: "1600x1600" },
  { id: "g09", file: "gallery/gallery-09.jpg", label: "Apartment living room", category: "Apartments", ratio: "3/2", size: "2000x1333" },
  { id: "g10", file: "gallery/gallery-10.jpg", label: "Exterior, wide view", category: "Exterior", ratio: "3/2", size: "2000x1333" },
  { id: "g11", file: "gallery/gallery-11.jpg", label: "Room workspace", category: "Rooms", ratio: "1/1", size: "1600x1600" },
  { id: "g12", file: "gallery/gallery-12.jpg", label: "Apartment kitchen", category: "Apartments", ratio: "3/4", size: "1500x2000" },
];