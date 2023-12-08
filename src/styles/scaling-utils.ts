import {baseHeight, baseWidth, HEIGHT, WIDTH} from '../constants/constants';

export const widthScale = (size = 1) => WIDTH * (size / baseWidth);

export const heightScale = (size = 1) => HEIGHT * (size / baseHeight);
