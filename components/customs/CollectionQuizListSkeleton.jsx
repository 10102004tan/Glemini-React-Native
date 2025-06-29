import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

const SUBJECT_COUNT = 3;
const QUIZ_PER_SUBJECT = 4;

const CollectionQuizListSkeleton = () => {
  return (
    <View style={styles.container}>
      {[...Array(SUBJECT_COUNT)].map((_, subjectIdx) => (
        <View key={subjectIdx} style={styles.subjectBlock}>
          <View style={styles.subjectHeader}>
            <View style={styles.subjectTitleSkeleton} />
            <View style={styles.seeMoreSkeleton} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(QUIZ_PER_SUBJECT)].map((_, quizIdx) => (
              <View key={quizIdx} style={styles.quizItemWrapper}>
                <View style={styles.quizItemSkeleton} />
              </View>
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flex: 1,
  },
  subjectBlock: {
    marginBottom: 20,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectTitleSkeleton: {
    width: 120,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  seeMoreSkeleton: {
    width: 100,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  quizItemWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
  quizItemSkeleton: {
    width: 180,
    height: 130,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
});

export default CollectionQuizListSkeleton;
