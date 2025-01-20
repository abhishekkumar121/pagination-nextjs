export const hotels = Array.from({ length: 100 }).map((_, index) => ({
  id: index + 1,
  name: `Hotel ${index + 1}`,
  rating: Math.floor(Math.random() * 5) + 1,
  price: Math.floor(Math.random() * 200) + 50,
}));
