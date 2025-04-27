# Meta Transaction DApp (Hardhat)

이 프로젝트는 **메타트랜잭션(Meta-Transaction)**을 지원하는 스마트컨트랙트(TextStorage, MinimalForwarder)와 하드햇(Hardhat) 기반의 배포/테스트 스크립트를 포함합니다.

## 주요 컨트랙트

- **MinimalForwarder.sol**: EIP-2771(메타트랜잭션) 표준을 구현한 포워더 컨트랙트
- **TextStorage.sol**: 메타트랜잭션을 통해 텍스트를 저장할 수 있는 컨트랙트

## 폴더 구조

```
contracts/         # 스마트컨트랙트 소스
scripts/           # 배포/메타트랜잭션 테스트 스크립트
 test/             # 하드햇 테스트 코드
hardhat.config.ts  # 하드햇 설정
```

## 환경설정

1. 의존성 설치
   ```sh
   npm install
   ```
2. 환경변수 설정
   - `.env` 파일에 배포자 프라이빗키 등 설정 (예시)
     ```
     DEPLOYER_PRIVATE_KEY=0x...
     ```

## 배포 방법 (Sepolia 테스트넷)

```sh
npx hardhat run scripts/deploy.ts --network sepolia
```
- 배포 후 MinimalForwarder, TextStorage 주소가 출력됩니다.

## 테스트 실행

```sh
npx hardhat test
```
- `test/TextStorageTest.ts`에서 컨트랙트 기능 및 메타트랜잭션 시나리오를 자동 테스트합니다.

## 메타트랜잭션 수동 테스트

1. `scripts/metaTxTest.ts`에서 배포된 컨트랙트 주소를 입력
2. 아래 명령어로 실행
   ```sh
   npx hardhat run scripts/metaTxTest.ts --network sepolia
   ```
- 실제 메타트랜잭션이 실행되고, 이벤트/저장값을 확인할 수 있습니다.

## 참고
- Sepolia 테스트넷 이더가 필요합니다. [Sepolia Faucet](https://sepoliafaucet.com/) 등에서 충전하세요.
- 배포/테스트 시 에러가 발생하면, 이더 잔액, 컨트랙트 주소, 환경변수 등을 점검하세요.
- 컨트랙트/테스트/스크립트 코드는 자유롭게 수정 가능합니다.

---
문의/이슈는 언제든 남겨주세요!

```
npx hardhat run scripts/deploy.ts --network sepolia
MinimalForwarder deployed to: 0x06e698E439701dd6ed543E3f715cB8f0978d07e7
TextStorage deployed to: 0xF38333e5DA5469FD497e27F504A620D96615D967

```
https://sepolia.etherscan.io/

https://sepolia.etherscan.io/address/0x0209f4B11478b2D1Af0f43351dAFd05d1Fd00a08
