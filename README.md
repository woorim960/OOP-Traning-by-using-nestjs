# OOP-Traning-by-using-nestjs
![nestjs-badge](https://img.shields.io/badge/Nestjs-orange)
![mariadb-badge](https://img.shields.io/badge/MariaDB-green)
![docker-compose-badge](https://img.shields.io/badge/Docker_Compose-red)
![typescript-badge](https://img.shields.io/badge/TypeScript-blue)
![typeorm-badge](https://img.shields.io/badge/TypeOrm-grey)
![jest-badge](https://img.shields.io/badge/Jest-yellow)  
객체지향프로그래밍을 훈련하기 위한 연습용 프로젝트

## 목차
* <a href="#프로젝트-소개">프로젝트 소개</a>
  * <a href="#요구-사항">요구 사항</a>
  * <a href="#기타-설정">기타 설정</a>
* <a href="#시작하기">시작하기</a>
  * <a href="#시작하기-전에">시작하기 전에</a>  
  * <a href="#실행">실행</a>  
  * <a href="#종료">종료</a>  

## 프로젝트 소개
> 유저 서비스  

모든 웹 애플리케이션의 필수 기능이라고 할 수 있는 유저 서비스를 개발.
* 참고 : [Nest.js로 배우는 백엔드 프로그래밍](https://wikidocs.net/book/7059)
* 저자 : [Dextto](https://github.com/dextto)
<img src="https://wikidocs.net/images/page/158464/1-7.png"></img>

### 요구 사항
* 회원 가입화면을 통해 유저 정보(이메일, 이름, 패스워드)를 입력받아 신규 회원 가입 처리를 수행하고 회원 정보를 데이터베이스에 저장합니다. 유저는 가입 준비 단계에 있게 됩니다.
* 회원 가입 과정에서 입력 받은 이메일로 회원 가입 확인 이메일을 전송합니다. 유저는 이메일을 확인하고 회원 가입 인증을 요청합니다. 이메일 본문에는 회원 가입 검증을 위한 요청으로서의 링크가 포함되어 있습니다. 이 링크를 통해 회원 가입 인증 요청이 들어오면 회원 가입 준비 단계에서 승인을 완료한 상태가 됩니다. 또 이메일 인증의 응답으로 바로 액세스 토큰(JWT)을 전달하여 로그인 상태가 되도록 합니다. 이렇게 하면 사용자가 인증 후 다시 로그인 과정을 거칠 필요가 없습니다.
* 회원 가입 완료된 사용자가 이메일과 비밀번호로 로그인 요청을 보내면 이를 처리합니다. 로그인 기능은 사실 사용자 에이전트(브라우저, 모바일 앱 등)에게 액세스 토큰(JWT)를 발급하는 것입니다.
* 사용자는 자신의 정보를 조회할 수 있습니다.

### 기타 설정
* **환경 변수 설정:** 
  * 개발자의 **로컬(local) 개발환경**
  * 개발된 기능을 실제 사용자에게 배포하기 전에 테스트용 서버에 배포하는 **스테이지(stage)환경**
  * 실제 운용하는 **프로덕션(production) 환경**
* **요청 유효성 검증:** 핵심 로직을 수행하기 전에 값이 제대로 전달되었는지 판단하여 만약 잘못 전달된 경우라면 400 Bad Request 에러로 응답합니다. 예를 들어 로그인 요청에서 이메일을 넣어야 하는데 이메일 형식이 아닌 문자열이 전달되면 에러로 처리합니다.
* **인증:** 사용자의 리소스에 접근하기 위해서는 권한이 필요하고 로그인 과정을 거쳐야 합니다. 로그인을 거친 유저는 매 요청마다 로그인을 할 필요는 없고 인증과정을 통해 후속 동작을 수행합니다.
  * JWT(JSON Web Token) 방식을 적용.
* **로깅:** 이슈가 발생했을 때 원인을 빠르고 정확하게 파악하는 데에 로그가 매우 유용하게 사용됩니다. 또한 사내 사용자가 무슨 동작을 수행했는지 감사로그를 남기고 외부에 기록을 제출하는 경우도 있습니다.
* **헬스체크:** 서버의 심장이 잘 뛰고 있는지, 즉 서버의 상태가 양호한지 주기적으로 검사합니다. 만약 서버 상태가 좋지 않다면 경고를 울려서 개발자가 빠르게 대응할 수 있는 방안을 마련해야 합니다.
* **CQRS(Command and Query Responsibility Segregation, 명령과 조회의 책임 분리):** 복잡한 소프트웨어를 만들다 보면 소스 코드가 스파게티처럼 얽히게 되는 경우가 생깁니다. 데이터베이스에 변형을 가하는 명령과 데이터 읽기 요청을 처리하는 조회 로직을 분리함으로써 성능, 확장성, 보안을 강화할 수 있습니다.
* **클린 아키텍처:** 양파(Onion) 아키텍처, 육각형 아키텍처에서 발전한 클린 아키텍처는 SW의 계층을 분리하고 저수준의 계층이 고수준의 계층에 의존하도록 합니다. 의존의 방향이 바뀌는 경우가 있다면 DIP(Dependency Inversion Principle, 의존성 역전 법칙)를 활용하여 안정적인 소프트웨어를 작성할 수 있게 해 줍니다.
* **유닛 테스트:** 소프트웨어에 변경이 생긴다면 반드시 테스트를 해야 합니다. 유닛 테스트는 유저의 입장에서 수행하는 테스트가 아닌 개발자가 테스트 코드를 이용하여 수행하는 최소 단위의 테스트 기법입니다. 내가 만든 코드 조각이 동작하는 조건을 기술하고, 주어진 입력에 대해 원하는 결과가 나오는 지 검사합니다.

## 시작하기
* **API 서버** : Nest.js  
* **DB** : MariaDB  
### 시작하기 전에
> 개발환경 세팅을 위한 사전 준비.
* [도커](https://docs.docker.com/get-docker/)와 [도커 컴포즈](https://docs.docker.com/compose/install/)를 설치합니다.
   > **Mac**과 **Windows**는 **Docker Desktop**을 설치했다면 **Docker Compose**도 함께 설치되므로 별도 설치할 필요 없습니다.
   1. 도커를 설치하려면 [여기](https://docs.docker.com/get-docker/)를 클릭해주세요.
   2. 도커 컴포즈를 설치하려면 [여기](https://docs.docker.com/compose/install/)를 클릭해주세요.

### 실행
> 개발환경을 구축합니다.  
> **API서버**와 **DB**를 명령어 하나로 손쉽게 구축할 수 있습니다.  

1. 저장소를 복제합니다.
   ```bash
   # 저장소 복제
   $ git clone https://github.com/modern-agile-team/OOP-Traning-by-using-nestjs

   # 저장소로 이동
   $ cd OOP-Traning-by-using-nestjs
   ```
2. docker-compose를 이용하여 ```API``` & ```DB``` 서버를 오픈합니다.
   ```bash
   $ docker-compose -f docker-compose.dev.yml up
   ```
3. 오픈된 서버에 접속합니다.
   > http://localhost:3000
4. 이제 코드를 변경하는대로 반영되어 동작됩니다.

### 종료
  ```bash
  $ docker-compose -f docker-compose.dev.yml down
  ```
