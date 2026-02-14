import { View, Text } from 'react-native'
import React from 'react'
import { Message } from '@/types';

interface MessageBubbleProps {
    message: Message;
    isFromMe: boolean;
  }

const MessageBubble = ({ message, isFromMe }: MessageBubbleProps) => {
  return (
    <View className={`flex-row ${isFromMe ? "justify-end" : "justify-start"}`}>
      <View
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isFromMe
            ? "bg-[#111] rounded-br-sm"
            : "bg-[#C2DFDA] rounded-bl-sm"
        }`}
      >
        <Text className={`text-sm ${isFromMe ? "text-white" : "text-black"}`}>
          {message.text}
        </Text>
      </View>
    </View>
  )
}

export default MessageBubble