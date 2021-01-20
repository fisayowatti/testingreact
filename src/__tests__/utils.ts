import { build, fake } from '@jackfranklin/test-data-bot'

interface ProductBuilder {
  id: number;
  image: string;
  name: string;
  price: string;
}

export const productBuilder = build<ProductBuilder>('Product', {
  fields: {
    id: fake((f) => f.random.number()),
    image: fake((f) => f.image.imageUrl()),
    name: fake((f) => f.lorem.words()),
    price: fake((f) => `from $${f.random.number(100)}`),
  },
})
