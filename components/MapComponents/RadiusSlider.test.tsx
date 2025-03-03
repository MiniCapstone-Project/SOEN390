import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RadiusSlider from './RadiusSlider';

describe('RadiusSlider', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <RadiusSlider searchRadius={500} setSearchRadius={jest.fn()} />
    );
    expect(getByText('Radius: 500m')).toBeTruthy();
  });

  it('calls setSearchRadius on slider value change', () => {
    const setSearchRadiusMock = jest.fn();
    const { getByTestId } = render(
      <RadiusSlider searchRadius={500} setSearchRadius={setSearchRadiusMock} />
    );
    const slider = getByTestId('slider');
    fireEvent.valueChange(slider, 600);
    expect(setSearchRadiusMock).toHaveBeenCalledWith(600);
  });
});
