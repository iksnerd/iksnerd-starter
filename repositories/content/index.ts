import { CmsService, ContentRepository, HomePageCmsResponse } from '@/core';

const homePageQuery = `
  query GetHomePage {
    homePages(first: 1) {
      title
      id
      createdAt
      updatedAt
    }
  }
`;

export function getContentRepository (
  cmsService: CmsService
): ContentRepository {
  return {
    async getHomePage () {
      const res = await cmsService.query<HomePageCmsResponse>(homePageQuery);
      if (!res) return null;
      const homePage = res?.data.homePages[0];
      
      return homePage;
    }
  };
}
