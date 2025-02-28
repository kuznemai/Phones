<script setup>

import CardOfItem from "../components/CardOfItem.vue";
</script>
<template>

  <section class="main_page">
    <div class="welcome_container block flex flex-row justify-center items-center gap-28 py-40 w-4/5 m-auto">
      <div class="welcome_inner-text">
        <h1 class="welcome__title fade-in text-5xl py-8 text-white sm:text-m">Fortress in Your Pocket</h1>
        <p class="welcome__desc fade-in text-3xl text-white sm:text-m">Unbreakable Security for Your Peace of Mind</p>
      </div>
      <div class="w-[400px] welcome_pic fade-in">
        <img src="/white_phone.jpg"/>
      </div>
    </div>


    <div class="introduction-container flex flex-row-reverse items-center justify-between w-4/5 m-auto py-40 gap-10">
      <div class="max-w-[500px] text-white">
        <h2 class="introduction-title text-3xl mb-5 text-justify sm:text-l">
          Introducing IZ: The Ultimate Mobile Operating System for Cryptocurrency Security
        </h2>
        <p class="introduction-desc text-xl text-justify sm:text-m">
          In the fast-paced digital world we live in today, privacy and security have become paramount concerns
          for individuals, especially when it comes to managing cryptocurrency assets. Meet IZ - a groundbreaking
          mobile operating system designed to provide unparalleled levels of privacy, security, and convenience
          for users looking to safeguard their digital assets on the go.
        </p>
      </div>
      <div class="max-w-[900px] flex-shrink-0 introduction__img ">
        <img src="/s3-phone.jpg" alt="phone"/>
      </div>
    </div>

    <div class="description_block flex flex-col justify-between items-center w-4/5 m-auto py-32">
      <img src="/characteristics.jpg" alt="characteristics" class="characteristics__image"/>
      <p class="description_text text-justify text-white text-xl py-24">
        IZ is based on a General Mobile Phone. One of the key distinguishing features of IZ is its Bitcoin-friendly
        nature. As the popularity of cryptocurrencies, especially Bitcoin, continues to soar, the need for a secure
        platform to store, manage, and transact these digital assets has never been more critical. IZ not only meets
        this need but exceeds expectations by providing a dedicated environment for users to interact with their
        cryptocurrencies safely and efficiently.
      </p>
    </div>

    <div class="product_description__container flex flex-row justify-between items-center w-4/5 m-auto py-24">
      <div class="max-w-[500px]">
        <p class="description text-justify text-white text-xl mb-10">
          IZ leverages the power of blockchain technology to create a tamper-proof ledger of all transactions,
          providing users with full transparency and auditability over their cryptocurrency activities. By harnessing
          the decentralized nature of blockchain, IZ eliminates single points of failure and creates a trustless
          environment where users have full control over their funds at all times.
        </p>
        <p class="text-justify text-white text-xl">
          In addition to its security features, IZ is designed to be user-friendly and accessible to individuals of all
          technical backgrounds. Whether you are a seasoned cryptocurrency investor or a newcomer to the world of
          digital assets, IZ provides a seamless and intuitive experience that empowers you to take full control of your
          financial future.
        </p>
      </div>
      <img src="/s1-img2.jpg" alt="white_phone" class="product_description__image fade-in w-80"/>
    </div>
  </section>
  <CardOfItem></CardOfItem>
</template>

<style>
* {
  font-family: "Roboto Thin", sans-serif;
}

/*Description*/

.introduction-container {
  position: relative;
  padding: 200px 0;
}

.introduction__img {
  position: absolute;
  left: -290px;
  /*box-shadow: 43px 38px 61px 0px rgba(255, 255, 255, 0.1);*/
}


@media (max-width: 550px) and (min-width: 320px) {

  .main_page {
    margin: 20px 0;
    padding: 0 0;
  }

  .welcome_container {
    display: flex;
    flex-direction: column;
    text-align: center;
    padding: 80px 0;
  }

  .welcome__title {
    width: 100%;
    font-size: 28px;
    font-family: "Roboto Thin", sans-serif;
    white-space: nowrap;
  }

  .welcome__desc {
    font-size: 18px;
    font-family: "Roboto Thin", sans-serif;
  }

  .introduction-container {
    width: 100%;
    padding: 40px 0;
  }

  .introduction-title {
    font-size: 18px;
  }

  .introduction-desc {
    font-size: 14px;
  }


  .welcome_pic {
    max-width: 100%;
  }

  .introduction__img {
    display: flex;
    width: 320px;
    left: 0;
    bottom: -150px;
  }

  .description_block {
    width: 100%;
    margin: 270px 0 40px 0;
    padding: 0;
  }

  .description_text {
    font-size: 14px;
    line-height: 25px;
    font-weight: 200;
    padding: 20px 0;
  }

  .characteristics__image {
    width: 100%;
    height: auto;
    margin: 30px 0;
  }

  .product_description__container {
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
    padding: 10px 0;
  }

  .product_description__container > div > p {
    font-size: 14px;
  }

  .product_description__image {
    width: 50%;
    margin-bottom: 50px;
  }


}

@media (max-width: 768px) and (min-width: 550px) {

  .welcome_container {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .welcome__title {
    font-size: 34px;
  }

  .welcome__desc {
    font-size: 24px;
  }

  .welcome_pic {
    max-width: 80%;
  }

  .introduction-container {
    padding-bottom: 100px;
  }

  .introduction__img {
    display: none;
  }

  .description_block {
    margin-top: 10px;
    padding: 0;
  }

  .characteristics__image {
    width: 100%;
    height: auto;
    margin-bottom: 40px;
  }

  .product_description__container {
    display: flex;
    flex-direction: column-reverse;
  }

  .product_description__image {
    width: 70%;
    margin: 0 auto 90px auto;
  }

  .block {
    padding: 20px 0 60px 0;
  }

}

@media (max-width: 1024px) and (min-width: 768px) {

  .welcome_container {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .welcome__title {
    font-size: 34px;
  }

  .welcome__desc {
    font-size: 24px;
  }

  .welcome_pic {
    max-width: 50%;
  }

  .introduction-container {
    padding: 0 0 100px 0;
  }

  .introduction__img {
    display: none;
  }

  .description_block {
    margin-top: 10px;
    padding: 0;
  }

  .characteristics__image {
    width: 100%;
    height: auto;
    margin-bottom: 40px;
  }

  .product_description__container {
    display: flex;
    flex-direction: column-reverse;
  }

  .product_description__image {
    width: 50%;
    margin: 0 auto 90px auto;
  }

  .block {
    padding: 20px 0 60px 0;
  }
}

@media (max-width: 1280px) and (min-width: 1024px) {
  .introduction-container {
    display: flex;
    justify-content: space-between;
  }

  .introduction-container > div:first-child {
    max-width: 400px;
  }

  .introduction__img {
    left: -620px;
  }

  .product_description__image {
    width: 40%;
    padding: 20px;
  }
}

@media (min-width: 1280px) {
  .introduction__img {
    position: absolute;
    left: -500px;
  }
}
</style>
