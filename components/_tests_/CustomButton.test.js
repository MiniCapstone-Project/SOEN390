import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomButton from '../CustomButton';

describe('CustomButton Component', () => {
  it('renders correctly with the given title', () => {
    const { getByText } = render(<CustomButton title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<CustomButton title="Click Me" onPress={mockOnPress} />);
    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles', () => {
    const { getByText } = render(
      <CustomButton
        title="Styled Button"
        onPress={() => {}}
        style={{ backgroundColor: 'blue' }}
        textStyle={{ color: 'yellow' }}
      />
    );
    const button = getByText('Styled Button');
    expect(button.props.style).toContainEqual({ color: 'yellow' });
  });
});
