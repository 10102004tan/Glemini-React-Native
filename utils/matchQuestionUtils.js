/**
 * Match Question Utilities
 * Centralized logic for handling match questions data flow
 */

/**
 * Convert V1 backend data to frontend display format
 * @param {Array} question_answer_ids - Array of answers from backend
 * @returns {Array} - Array of options for frontend display
 */
export const convertV1ToFrontend = (question_answer_ids = []) => {
  console.log('🔄 Converting V1 backend data to frontend format');
  console.log('🔄 Input:', JSON.stringify(question_answer_ids, null, 2));

  const options = question_answer_ids.map((answer) => {
    const baseOption = {
      id: answer._id,
      _id: answer._id,
      text: answer.text,
      correct: true, // Match questions typically have all options as correct
    };

    // Check if this answer has match data
    if (answer.attributes?.match) {
      baseOption.matchPair = answer.attributes.match;
      console.log(`🔄 Real pair: "${answer.text}" -> "${answer.attributes.match}"`);
    } else {
      console.log(`🔄 Default option: "${answer.text}" (no match)`);
    }

    return baseOption;
  });

  console.log('🔄 Frontend options:', JSON.stringify(options, null, 2));
  return options;
};

/**
 * Convert frontend data to V1 backend format for saving
 * @param {Array} options - Array of frontend options
 * @returns {Array} - Array of answers for backend
 */
export const convertFrontendToV1 = (options = []) => {
  console.log('🔄 Converting frontend data to V1 backend format');
  console.log('🔄 Input options:', JSON.stringify(options, null, 2));

  const answers = options.map((option) => {
    const answer = {
      text: option.text,
      image: option.image || '',
      correct: true, // Match questions have all options as correct
      attributes: {},
    };

    // Add match data if exists
    if (option.matchPair && option.matchPair !== '') {
      answer.attributes.match = option.matchPair;
      console.log(`🔄 Saving real pair: "${option.text}" -> "${option.matchPair}"`);
    } else {
      console.log(`🔄 Saving default option: "${option.text}" (no match)`);
    }

    // Keep existing ID if editing
    if (option._id && typeof option._id === 'string' && option._id.length === 24) {
      answer._id = option._id;
    }

    return answer;
  });

  console.log('🔄 Backend answers:', JSON.stringify(answers, null, 2));
  return answers;
};

/**
 * Create display pairs for MatchEditor based on backend structure
 * @param {Array} options - Array of frontend options (question_answer_ids)
 * @param {Array} correctAnswers - Array of correct answers (correct_answer_ids)
 * @returns {Array} - Array of pairs for display
 */
export const createDisplayPairs = (options = [], correctAnswers = []) => {
  console.log('🔄 ===== DISPLAY PAIRS DEBUG =====');
  console.log('🔄 Input options:', JSON.stringify(options, null, 2));
  console.log('🔄 Input correctAnswers:', JSON.stringify(correctAnswers, null, 2));

  const pairs = [];

  // Check if we have correct_answer_ids data
  if (correctAnswers && correctAnswers.length > 0) {
    console.log('🔄 Using correct_answer_ids method...');

    // Extract IDs from correct_answer_ids (these are left items)
    const leftIds = correctAnswers.map((correct) => correct._id || correct.id);
    console.log('🔄 Left IDs from correct_answer_ids:', leftIds);

    // Find left items from question_answer_ids
    const leftItems = options.filter((option) => {
      const optionId = option._id || option.id;
      const isLeft = leftIds.includes(optionId);
      console.log(`🔄 Option "${option.text}" (ID: ${optionId}) → ${isLeft ? 'LEFT' : 'NOT LEFT'}`);
      return isLeft;
    });

    // Find right items (remaining items not in correct_answer_ids)
    const rightItems = options.filter((option) => {
      const optionId = option._id || option.id;
      const isRight = !leftIds.includes(optionId);
      console.log(
        `🔄 Option "${option.text}" (ID: ${optionId}) → ${isRight ? 'RIGHT' : 'NOT RIGHT'}`,
      );
      return isRight;
    });

    console.log(`🔄 ===== CLASSIFICATION RESULT =====`);
    console.log(`🔄 LEFT ITEMS (${leftItems.length}):`);
    leftItems.forEach((item, index) => {
      console.log(`🔄   [${index}] "${item.text}" (ID: ${item._id || item.id})`);
    });

    console.log(`🔄 RIGHT ITEMS (${rightItems.length}):`);
    rightItems.forEach((item, index) => {
      console.log(`🔄   [${index}] "${item.text}" (ID: ${item._id || item.id})`);
    });

    // ENHANCED LOGIC: Handle mixed data scenarios
    // Check for mixed data: some pairs valid, some invalid
    const hasValidPairs = rightItems.length > 0;
    const hasInvalidPairs = leftItems.length > rightItems.length;

    if (!hasValidPairs && leftItems.length >= 2) {
      // SPECIAL CASE 1: All options marked as correct (pure invalid data)
      console.log('🔄 ⚠️  SPECIAL CASE 1: All options marked as correct (pure invalid data)');
      console.log('🔄 ⚠️  Falling back to pair-by-order logic...');

      // Fallback: Use pair-by-order logic even with correct_answer_ids
      for (let i = 0; i < leftItems.length; i += 2) {
        const leftItem = leftItems[i];
        const rightItem = leftItems[i + 1];

        if (leftItem) {
          const pair = {
            id: `pair-${Math.floor(i / 2)}`,
            left: leftItem?.text || '[Thiếu left]',
            right: rightItem?.text || '[Thiếu right]',
            leftOptionId: leftItem?.id || leftItem?._id,
            rightOptionId: rightItem?.id || rightItem?._id,
            pairIndex: Math.floor(i / 2),
            isReal: true,
            isFallback: true,
            isSpecialCase: true,
          };

          pairs.push(pair);

          console.log(`🔄 ===== SPECIAL CASE 1 PAIR ${Math.floor(i / 2)} =====`);
          console.log(`🔄 Left: "${pair.left}" (ID: ${pair.leftOptionId})`);
          console.log(`🔄 Right: "${pair.right}" (ID: ${pair.rightOptionId})`);
        }
      }
    } else if (hasValidPairs && hasInvalidPairs) {
      // SPECIAL CASE 2: Mixed data (some valid pairs + some invalid data)
      console.log('🔄 ⚠️  SPECIAL CASE 2: Mixed data detected (valid + invalid)');
      console.log(`🔄 ⚠️  Left items: ${leftItems.length}, Right items: ${rightItems.length}`);

      // Strategy: Use pair-by-order for ALL items to maintain consistency
      // This prevents the "New1-OK2" cross-pairing issue
      console.log('🔄 ⚠️  Using pair-by-order for ALL items to maintain consistency...');

      const allItems = options; // Use original options order
      for (let i = 0; i < allItems.length; i += 2) {
        const leftItem = allItems[i];
        const rightItem = allItems[i + 1];

        if (leftItem) {
          const pair = {
            id: `pair-${Math.floor(i / 2)}`,
            left: leftItem?.text || '[Thiếu left]',
            right: rightItem?.text || '[Thiếu right]',
            leftOptionId: leftItem?.id || leftItem?._id,
            rightOptionId: rightItem?.id || rightItem?._id,
            pairIndex: Math.floor(i / 2),
            isReal: true,
            isFallback: true,
            isMixedCase: true,
          };

          pairs.push(pair);

          console.log(`🔄 ===== MIXED CASE PAIR ${Math.floor(i / 2)} =====`);
          console.log(`🔄 Left: "${pair.left}" (ID: ${pair.leftOptionId})`);
          console.log(`🔄 Right: "${pair.right}" (ID: ${pair.rightOptionId})`);
        }
      }
    } else {
      // Normal case: Create pairs by matching left and right items by index
      const maxPairs = Math.max(leftItems.length, rightItems.length);
      console.log(`🔄 Creating ${maxPairs} pairs...`);

      for (let i = 0; i < maxPairs; i++) {
        const leftItem = leftItems[i];
        const rightItem = rightItems[i];

        if (leftItem || rightItem) {
          const pair = {
            id: `pair-${i}`,
            left: leftItem?.text || '[Thiếu left]',
            right: rightItem?.text || '[Thiếu right]',
            leftOptionId: leftItem?.id || leftItem?._id,
            rightOptionId: rightItem?.id || rightItem?._id,
            pairIndex: i,
            isReal: true,
          };

          pairs.push(pair);

          console.log(`🔄 ===== PAIR ${i} =====`);
          console.log(`🔄 Left: "${pair.left}" (ID: ${pair.leftOptionId})`);
          console.log(`🔄 Right: "${pair.right}" (ID: ${pair.rightOptionId})`);
        }
      }
    }
  } else {
    console.log('🔄 Using FALLBACK method (no correct_answer_ids)...');
    console.log('🔄 Assuming pairs by order: [0,1], [2,3], [4,5], etc.');

    // FALLBACK: Assume pairs by order when no correct_answer_ids
    // [0,1] = pair 1, [2,3] = pair 2, etc.
    for (let i = 0; i < options.length; i += 2) {
      const leftItem = options[i];
      const rightItem = options[i + 1];

      if (leftItem) {
        const pair = {
          id: `pair-${Math.floor(i / 2)}`,
          left: leftItem?.text || '[Thiếu left]',
          right: rightItem?.text || '[Thiếu right]',
          leftOptionId: leftItem?.id || leftItem?._id,
          rightOptionId: rightItem?.id || rightItem?._id,
          pairIndex: Math.floor(i / 2),
          isReal: true,
          isFallback: true,
        };

        pairs.push(pair);

        console.log(`🔄 ===== FALLBACK PAIR ${Math.floor(i / 2)} =====`);
        console.log(`🔄 Left: "${pair.left}" (ID: ${pair.leftOptionId})`);
        console.log(`🔄 Right: "${pair.right}" (ID: ${pair.rightOptionId})`);
      }
    }
  }

  // Handle legacy options with matchPair (for backward compatibility)
  const legacyOptions = options.filter((option) => option.matchPair && option.matchPair !== '');

  console.log(`🔄 Found ${legacyOptions.length} legacy options with matchPair`);

  // Add legacy pairs (for backward compatibility)
  legacyOptions.forEach((option, index) => {
    pairs.push({
      id: option.id || option._id,
      left: option.text,
      right: option.matchPair,
      leftOptionId: option.id || option._id,
      rightOptionId: null, // No separate right option for legacy format
      pairIndex: pairs.length,
      isReal: true,
      isLegacy: true,
    });

    console.log(`🔄 Created legacy pair: "${option.text}" → "${option.matchPair}"`);
  });

  console.log(`🔄 Created ${pairs.length} total display pairs:`, JSON.stringify(pairs, null, 2));
  return pairs;
};

/**
 * Add a new match pair to options array (backend structure)
 * @param {Array} currentOptions - Current options array (question_answer_ids)
 * @param {string} left - Left text
 * @param {string} right - Right text
 * @returns {Object} - Updated options and correct answers
 */
export const addMatchPair = (currentOptions = [], left, right) => {
  console.log('🔄 Adding new match pair (backend structure):', { left, right });
  console.log('🔄 Current options:', JSON.stringify(currentOptions, null, 2));

  const timestamp = Date.now();

  // Create left answer (will be added to correct_answer_ids)
  const leftOption = {
    _id: timestamp,
    text: left,
    image: '',
    correct: true,
  };

  // Create right answer (will NOT be added to correct_answer_ids)
  const rightOption = {
    _id: timestamp + 1,
    text: right,
    image: '',
    correct: true,
  };

  // Add both to question_answer_ids
  const updatedOptions = [...currentOptions, leftOption, rightOption];

  console.log('🔄 Updated options after adding pair:', JSON.stringify(updatedOptions, null, 2));

  return {
    options: updatedOptions,
    newLeftId: leftOption._id, // This should be added to correct_answer_ids
  };
};

/**
 * Delete a match pair from options array (backend structure)
 * @param {Array} currentOptions - Current options array (question_answer_ids)
 * @param {string} leftOptionId - ID of left option
 * @param {string} rightOptionId - ID of right option
 * @param {number} pairIndex - Index of the pair to delete
 * @returns {Object} - Updated options and removed left ID
 */
export const deleteMatchPair = (currentOptions = [], leftOptionId, rightOptionId, pairIndex) => {
  console.log('🔄 Deleting match pair (backend structure):', {
    leftOptionId,
    rightOptionId,
    pairIndex,
  });
  console.log('🔄 Current options:', JSON.stringify(currentOptions, null, 2));

  // Delete both left and right answers from question_answer_ids
  let updatedOptions = currentOptions.filter((option) => {
    const optionId = option.id || option._id;
    return optionId !== leftOptionId && optionId !== rightOptionId;
  });

  // For legacy method: if no rightOptionId, just delete the single option
  if (!rightOptionId && leftOptionId) {
    updatedOptions = currentOptions.filter((option) => (option.id || option._id) !== leftOptionId);
  }

  console.log('🔄 Updated options after deleting pair:', JSON.stringify(updatedOptions, null, 2));

  return {
    options: updatedOptions,
    removedLeftId: leftOptionId, // This should be removed from correct_answer_ids
  };
};
