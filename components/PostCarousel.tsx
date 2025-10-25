import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "./ui/carousel";

export default function PostCarousel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  
  return (
    <Carousel
      opts={{ align: "center", loop: true }}
      className="w-full h-auto relative"
    >
      <CarouselContent>
        {images.map((item, index) => (
          <CarouselItem key={index} className="w-full h-full aspect-square">
            <img
              src={item}
              alt={title || `Image ${index + 1}`}
              className="h-full w-full object-cover rounded-none md:rounded-md"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {images.length > 1 && (
        <CarouselNext className="absolute top-1/2 right-1 transform -translate-y-1/2 z-50" />
      )}
    </Carousel>
  );
}
