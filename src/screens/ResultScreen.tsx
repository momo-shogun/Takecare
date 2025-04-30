import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ResultScreen({ route }: any) {
  const navigation = useNavigation();
  const { photoPath } = route.params;

  return (
    <>
      <ScrollView>
        <View className="flex-1 bg-white px-4 py-5">
          <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
            Your Skin Analysis
          </Text>

          <View className="items-center mb-6">
            <Image
              source={{ uri: photoPath }}
              className="w-48 h-48 rounded-full border-4 border-teal-400"
            />
          </View>

          <View className="bg-teal-50 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-700 mb-2">Detected Skin Type:</Text>
            <Text className="text-xl font-bold text-teal-600">Oily</Text>
          </View>

          <View className="bg-orange-50 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-700 mb-2">Concerns:</Text>
            <Text className="text-base text-orange-600">• Enlarged Pores</Text>
            <Text className="text-base text-orange-600">• Acne</Text>
          </View>

          <View className="bg-indigo-50 rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-700 mb-2">Recommended Routine:</Text>
            <Text className="text-base text-indigo-600">✔ Gel Cleanser</Text>
            <Text className="text-base text-indigo-600">✔ Salicylic Acid Serum</Text>
            <Text className="text-base text-indigo-600">✔ Oil-Free Moisturizer</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-teal-600 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold text-lg">Scan Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
