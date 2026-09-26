// Test fixture: Contains intentional "slop" patterns for detection testing
// DO NOT clean up this file — it is used as test input

export function processData(items: any[]) {
  console.log('processing items:', items);

  const result = items.map((item) => {
    try {
      // Nested ternary — should be flagged by LOGIC-001
      const status = item.active
        ? item.verified
          ? 'active-verified'
          : 'active-unverified'
        : 'inactive';

      console.log('status:', status);

      return { ...item, status };
    } catch (e) {
      // Empty catch block — should be flagged by LOGIC-002
    }
  });

  debugger; // Should be flagged by ARTIFACT-002

  console.debug('result:', result);

  return result;
}
