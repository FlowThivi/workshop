import { A2appPage } from './app.po';

describe('a2app App', function() {
  let page: A2appPage;

  beforeEach(() => {
    page = new A2appPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
