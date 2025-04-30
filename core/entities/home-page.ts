import { z } from 'zod';
import { baseEntitySchema } from '@/core';
// const homePageQuery = `
//   query GetHomePage {
//     homePages(first: 1) {
//       title
//     }
//   }
// `;


export const homePageDataSchema = z.object({
  title: z.string(),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});


export const homePageSchema = baseEntitySchema.merge(homePageDataSchema);

export type HomePageData = z.infer<typeof homePageSchema>;

export type HomePage = z.infer<typeof homePageSchema>;

export const homePageCmsResponseSchema = z.object({
  data: z.object({
    homePages: z.array(homePageDataSchema),
  })
});

export type HomePageCmsResponse = z.infer<typeof homePageCmsResponseSchema>;
