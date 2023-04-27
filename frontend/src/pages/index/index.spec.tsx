import { render, screen } from '@testing-library/react';
import { Index } from './index';

describe('Index Page', () => {
  it('should render', () => {
    render(<Index name="foo" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
