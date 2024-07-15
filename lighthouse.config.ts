import { Config } from 'lighthouse';

export const config: Config = {
    extends: 'lighthouse:default',
    settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    },
};
