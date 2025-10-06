import { render } from '@testing-library/react';

import MyUx from './my-ux';

describe('MyUx', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyUx />);
    expect(baseElement).toBeTruthy();
  });
});
