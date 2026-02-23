import { setTitle } from './setTitle';

describe('setTitle', () => {
  const originalDocumentTitle = document.title;

  beforeEach(() => {
    document.title = originalDocumentTitle; // Reset title before each test
  });

  test('should set the document title correctly', () => {
    // Arrange
    const newTitle = 'My New Page Title';

    // Act
    setTitle(newTitle);

    // Assert
    expect(document.title).toBe(newTitle);
  });
});
