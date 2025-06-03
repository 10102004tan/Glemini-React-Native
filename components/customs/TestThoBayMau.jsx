const { default: LottieView } = require('lottie-react-native');

const TestThoBayMau = () => {
  return (
    <LottieView
      loop={true}
      autoPlay={true}
      style={{
        width: 200,
        height: 200,
      }}
      source={require('@/assets/lotties/thobaymau.json')}
    />
  );
};

export default TestThoBayMau;
