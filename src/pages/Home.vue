<script setup lang="ts">
</script>
<template>

  <section class="main_page overflow-x-hidden">
    <div
      class="welcome_container mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 py-16 sm:px-6 sm:py-20 md:gap-16 md:py-28 lg:flex-row lg:gap-20 lg:py-32 xl:gap-28 xl:py-40"
    >
      <div class="welcome_inner-text max-w-xl text-center lg:text-left">
        <h1 class="welcome__title fade-in py-4 text-5xl text-white sm:text-m md:py-6 lg:py-8">Fortress in Your Pocket</h1>
        <p class="welcome__desc fade-in text-3xl text-white sm:text-m">Unbreakable Security for Your Peace of Mind</p>
      </div>
      <div class="welcome_pic fade-in w-full max-w-[400px] shrink-0">
        <img src="/white_phone.jpg" alt="" class="h-auto w-full" />
      </div>
    </div>


    <div
      class="introduction-container mx-auto flex w-full max-w-6xl flex-row-reverse items-center justify-between gap-10 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-[500px]">
        <h2 class="introduction-title text-3xl mb-5 text-justify text-zinc-300 sm:text-l">
          Introducing IZ: The Ultimate Mobile Operating System for Cryptocurrency Security
        </h2>
        <p class="introduction-desc text-xl text-justify text-zinc-400 sm:text-m">
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

    <div
      class="description_block mx-auto flex w-full max-w-6xl flex-col items-center justify-between px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      <img src="/characteristics.jpg" alt="characteristics" class="characteristics__image"/>
      <p class="description_text text-justify text-zinc-400 text-xl py-24">
        IZ is based on a General Mobile Phone. One of the key distinguishing features of IZ is its Bitcoin-friendly
        nature. As the popularity of cryptocurrencies, especially Bitcoin, continues to soar, the need for a secure
        platform to store, manage, and transact these digital assets has never been more critical. IZ not only meets
        this need but exceeds expectations by providing a dedicated environment for users to interact with their
        cryptocurrencies safely and efficiently.
      </p>
    </div>

    <div
      class="product_description__container mx-auto flex w-full max-w-6xl flex-row items-center justify-between px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div class="max-w-[500px]">
        <p class="description text-justify text-zinc-400 text-xl mb-10">
          IZ leverages the power of blockchain technology to create a tamper-proof ledger of all transactions,
          providing users with full transparency and auditability over their cryptocurrency activities. By harnessing
          the decentralized nature of blockchain, IZ eliminates single points of failure and creates a trustless
          environment where users have full control over their funds at all times.
        </p>
        <p class="text-justify text-zinc-400 text-xl">
          In addition to its security features, IZ is designed to be user-friendly and accessible to individuals of all
          technical backgrounds. Whether you are a seasoned cryptocurrency investor or a newcomer to the world of
          digital assets, IZ provides a seamless and intuitive experience that empowers you to take full control of your
          financial future.
        </p>
      </div>
      <img
        src="/s1-img2.jpg"
        alt="white_phone"
        class="product_description__image fade-in w-full max-w-[20rem] shrink-0"
      />
    </div>
  </section>
</template>

<style>
* {
  font-family: "Roboto Thin", sans-serif;
}

/* Intro block: stacked on phones & laptops; wide desktop keeps side image */
.introduction-container {
  position: relative;
}

.introduction__img {
  position: relative;
  left: auto;
}

@media (max-width: 1279px) {
  .introduction-container {
    flex-direction: column-reverse !important;
    align-items: center;
    padding-top: 3rem !important;
    padding-bottom: 3rem !important;
  }

  .introduction__img {
    position: relative !important;
    left: auto !important;
    bottom: auto !important;
    display: block;
    width: 100%;
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
  }

  .introduction-container > div:first-child {
    max-width: 42rem;
    width: 100%;
  }

  .description_block {
    margin-top: 0 !important;
  }
}

@media (min-width: 1280px) {
  .introduction-container {
    flex-direction: row-reverse;
    padding: 200px 0;
    align-items: center;
    justify-content: space-between;
  }

  .introduction__img {
    position: absolute;
    left: -660px;
    max-width: 900px;
  }
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
    white-space: normal;
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
    max-width: 100%;
  }

  .description_block {
    width: 100%;
    margin: 2rem 0 1.5rem;
    padding-left: 0;
    padding-right: 0;
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

@media (max-width: 1279px) and (min-width: 1024px) {
  .product_description__image {
    width: min(50%, 20rem);
    margin-left: auto;
    margin-right: auto;
  }
}

</style>
