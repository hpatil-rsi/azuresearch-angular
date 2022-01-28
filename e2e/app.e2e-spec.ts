import { suitesTemplatePage } from './app.po';

describe('suites App', function() {
  let page: suitesTemplatePage;

  beforeEach(() => {
    page = new suitesTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
