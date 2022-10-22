<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/header/my-profile">
          <ion-icon :icon="ellipsePath" />
          <ion-label>мой профиль</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/header/all-rooms">
          <ion-icon :icon="ellipsePath" />
          <ion-label>комнаты</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/header/create-room">
          <ion-icon :icon="ellipsePath" />
          <ion-label>создать комнату</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab4" href="/header/the-invitations">
          <ion-icon :icon="ellipsePath" />
          <ion-label>приглашения</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab5" href="/header/my-profile">
          <ion-icon :icon="ellipsePath" />
          <ion-label>выйти</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from '@ionic/vue';
import { ellipse } from 'ionicons/icons';

const ellipsePath = ref<string>(ellipse);
</script>
