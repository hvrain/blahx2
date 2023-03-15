import { Box, Button } from '@chakra-ui/react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '@/contexts/auth_user.context';
import FirebaseClient from '../models/firebase_client';

const provider = new GoogleAuthProvider();

const GoogleLoginButton: React.FC = function () {
  const { authUser, isLoading, signInWithGoogle } = useAuth();

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
        onClick={signInWithGoogle}
      >
        구글 로그인
      </Button>
    </Box>
  );
};

export default GoogleLoginButton;
