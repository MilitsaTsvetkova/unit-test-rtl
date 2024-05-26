import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json([
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Beauty' },
      { id: 3, name: 'Gardening' },
    ])
  }),
  http.get('/products', () => {
    return HttpResponse.json([
      { id: 1, name: 'Product1' },
      { id: 2, name: 'Product2' },
      { id: 3, name: 'Product3' },
    ])
  }),
]
