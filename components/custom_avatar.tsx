/* eslint-disable react/jsx-props-no-spreading */
import { Avatar, AvatarProps } from '@chakra-ui/react';

const BROKEN_LINK = 'https://bit.ly/broken-link';

const CustomAvatar: React.FC<AvatarProps> = function ({ ...avatarProps }) {
  const { src } = avatarProps;
  return <Avatar {...avatarProps} src={src ?? BROKEN_LINK} bgColor="gray.200" />;
};

export default CustomAvatar;
