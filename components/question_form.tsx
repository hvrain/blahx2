import { Button, Flex, FormControl, FormLabel, Switch, Textarea, useToast, UseToastOptions } from '@chakra-ui/react';
import { useState } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import CustomAvatar from './custom_avatar';
import { useAuth } from '@/contexts/auth_user.context';
import { InAuthUser } from '../models/in_auth_user';

type Props = {
  userInfo: InAuthUser;
};

async function postMessage({
  uid,
  message,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string | null;
    photoURL: string | null;
  };
}) {
  try {
    await fetch('/api/message.post', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        message,
        author,
      }),
    });
    return {
      result: true,
    };
  } catch {
    return {
      result: false,
    };
  }
}

const QuestionForm: React.FC<Props> = function ({ userInfo }) {
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const toast = useToast();
  const { authUser } = useAuth();
  const [lastToastTime, setLastToastTime] = useState(0);

  const clickButton = async () => {
    if (message === '') {
      showToast({
        status: 'error',
        title: '질문을 입력해주세요.',
      });
      return;
    }
    const author = {
      displayName: authUser?.displayName ?? '',
      photoURL: authUser?.photoURL ?? '',
    };
    const postData = {
      uid: userInfo.uid,
      message,
      author: isAnonymous ? undefined : author,
    };
    const resp = await postMessage(postData);
    if (resp.result === false) {
      showToast({
        status: 'error',
        title: '메세지 등록에 실패했습니다.',
      });
      return;
    }
    showToast({
      status: 'success',
      title: '메세지를 등록하였습니다.',
    });
    setMessage('');
  };

  function throttleToast(options: UseToastOptions, delay = 1000) {
    const now = Date.now();
    if (now - lastToastTime < delay) return;
    toast(options);
    setLastToastTime(now);
  }

  function showToast(options: UseToastOptions) {
    const { status, title } = options;
    toast({
      status,
      title,
      position: options.position ?? 'bottom-right',
      isClosable: options.isClosable ?? true,
      duration: options.duration ?? 3000,
    });
  }

  return (
    <Flex direction="column" gap="2" bgColor="white" px="3" py="2" borderRadius="md" overflow="hidden">
      <Flex gap="2" align="center">
        <CustomAvatar size="xs" name="test" src={!isAnonymous ? userInfo?.photoURL ?? undefined : undefined} />
        <Textarea
          bgColor="gray.100"
          resize="none"
          border="none"
          placeholder="질문을 입력해주세요"
          minH="unset"
          as={TextareaAutosize}
          maxRows={7}
          value={message}
          onChange={(e) => {
            const regaxLine = /\n/g;
            const lineCount = (e.currentTarget.value.match(regaxLine)?.length ?? 1) + 1;
            if (lineCount > 7) {
              throttleToast({
                status: 'error',
                title: '최대 7줄까지 작성 가능합니다.',
                position: 'bottom-right',
                isClosable: true,
                duration: 3000,
              });
              return;
            }
            setMessage(e.currentTarget.value);
          }}
        />
        <Button
          minW="12"
          bgColor="orage.400"
          color="white"
          colorScheme="orange"
          onClick={async () => {
            if (message === '') {
              showToast({
                status: 'error',
                title: '질문을 입력해주세요.',
              });
              return;
            }
            const author = {
              displayName: authUser?.displayName ?? '',
              photoURL: authUser?.photoURL ?? '',
            };
            const postData = {
              uid: userInfo.uid,
              message,
              author: isAnonymous ? undefined : author,
            };
            const resp = await postMessage(postData);
            if (resp.result === false) {
              showToast({
                status: 'error',
                title: '메세지 등록에 실패했습니다.',
              });
              return;
            }
            showToast({
              status: 'success',
              title: '메세지를 등록하였습니다.',
            });
            setMessage('');
          }}
        >
          입력
        </Button>
      </Flex>
      <FormControl display="flex" gap="2">
        <Switch
          size="sm"
          id="anonymous"
          isChecked={isAnonymous}
          onChange={() => {
            if (authUser === null) {
              showToast({
                status: 'warning',
                title: '로그인이 필요합니다.',
              });
              return;
            }
            setIsAnonymous((p) => !p);
          }}
        />
        <FormLabel fontSize="2xs" htmlFor="anonymous">
          Anonymous
        </FormLabel>
      </FormControl>
    </Flex>
  );
};

export default QuestionForm;
