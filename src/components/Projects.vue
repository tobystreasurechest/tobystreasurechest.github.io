<template>
    <div class="additional-content">
      <a href="src\assets\livstudy.png"><img :src="livimg" width="280" height="194.77"></a>
    </div>
    <div class="livcontent">
        <h3>LivStudy</h3>
        <p style="font-size: 14px; line-height: 2;">LivStudy builds an online learning platform that integrates learning planning, 
            <strong>live self-study</strong> and learning feedback. This project uses NLP technology and GPT 
            model to design an autonomous learning intelligent question answering model that 
            can automatically generate answers, so as to further improve the learning effect of users.
        </p>
    </div>
    <div class="additional-content2">
      <a href="src\assets\bdci.jpg"><img :src="bdciimg" width="280" height="194.77"></a>
    </div>
    <div class="bdcicontent">
        <h3>CCF BDCI</h3>
        <p style="font-size: 14px; line-height: 2;">Implemented and optimized Long Short-Term Memory networks (LSTM) to handle temporal dependencies in urban population data, capturing short-term and long-term population trends.
          Employed k-fold cross-validation during the model training phase to ensure robustness of evaluation results and optimization of model parameters.
        </p>
    </div>
  </template>
  
  <script>
  import liv from '@/assets/livstudy.png'
  import bdci from '@/assets/bdci.jpg'
  export default {
    name: 'ProjectsContent',
    data(){
        return{
            livimg:liv,
            bdciimg:bdci
        }
    }
  }
  </script>
  
  <style scoped>
  .additional-content {
    position:absolute;
    left: 550px;
    top: 720px;
  }
  .livcontent {
    position:absolute;
    left: 900px;
    top: 700px;
    width: 530px;
    height: 40px;
    text-align: justify;
  }
  .additional-content2 {
    position:absolute;
    left: 550px;
    top: 1020px;
  }
  .bdcicontent {
    position:absolute;
    left: 900px;
    top: 1000px;
    width: 530px;
    height: 40px;
    text-align: justify;
  }

  </style>

  