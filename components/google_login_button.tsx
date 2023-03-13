import { Box, Button } from '@chakra-ui/react';

// type Props = {};

const GoogleLoginButton: React.FC = function () {
  return (
    <Box>
      <Button
        size="lg"
        w="full"
        minW="sm"
        maxW="md"
        borderRadius="full"
        bgColor="#4285f4"
        color="white"
        leftIcon={
          <img
            style={{
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: '1px',
            }}
            src="/google.svg"
            alt="구글 로고"
          />
        }
      >
        구글 로그인
      </Button>
    </Box>
  );
};

export default GoogleLoginButton;
