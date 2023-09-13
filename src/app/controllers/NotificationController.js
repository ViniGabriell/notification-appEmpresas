import { Expo } from 'expo-server-sdk';
import moment from 'moment';
import defs from '../lib/GlobalDefs';
import queues from '../lib/Queue';
import { login } from '../services/auth';
import {
  getAllUnreadNotifications,
  newNotification,
  updateNotification,
} from '../services/notification';
import {
  getCheckinQuery,
  getWeekendCalendar,
  getCheckinRememberQuery,
  getProposalRefuseds,
  getOrganizeWeekly,
} from '../services/proposal';

moment.locale('pt-br');

// Função para enviar notificações
export const sendNotifications = async () => {
  const expo = new Expo({});
  const token = await login("sistema@eshows.com.br", "140414");
  const unreadNotifications = await getAllUnreadNotifications(token);

  // * Percorrer todas as notificações não enviadas e adicionar a fila salvando o id do job
  await Promise.all(
    unreadNotifications.map(async (unreadNotification) => {
      console.log("unreadNotification", unreadNotification);
      if (unreadNotification.EXPO_TOKEN) {

        let messages = [{
          to: unreadNotification.EXPO_TOKEN,
          sound: 'default',
          title: unreadNotification.TITLE,
          notificationId: unreadNotification.ID,
          body: unreadNotification.BODY,
          text: unreadNotification.BODY,
          time: unreadNotification.START_TASK,
        }];

        const response = await expo.sendPushNotificationsAsync(messages);

        console.log("sendPushNotificationsAsync", response)
        if (unreadNotification.ID) {
          await updateNotification(token, { JOB_ID: 1, 'NOTIFICATION_READ': 0 }, unreadNotification.ID);
        }
      }
    })
  );
};

export const sendNotificationsByUserId = async (req, res) => {
  const token = await login('sistema@eshows.com.br', '140414');
  const { id } = req.params
  const { title, body } = req.body

  await newNotification(token, {
    TITLE: title,
    BODY: body,
    NOTIFICATION_READ: true,
    START_TASK: moment().subtract(3, 'h').format('YYYY-MM-DD HH:mm:00'),
    END_TASK: moment().subtract(3, 'h').format('YYYY-MM-DD HH:mm:00'),
    APP_ARTISTAS_NEW: true,
    ORIGEM: 'Front operacao',
    TIPO: 'Notification by Id',
    FK_USER: id,
  });

  return res.status(200).json({ id });
}

export const scheduleNotification = async (body) => {
  try {
    const now = moment();
    const scheduleTime = moment(body.time);
    const diffTime = scheduleTime.diff(now);
    const jobId = await queues.addJob(defs.JobType.NotificationJob, {
      ...body,
      options: { delay: diffTime },
    });
    return jobId;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const reviewReminder = async () => {
  try {
    // * Pegar o token para fazer as requisições
    const token = await login("notificacao@eshows.com.br", "140414");

    // * Pegar todas as propostas que ainda não passaram e não foram notificadas
    const proposals = await getCheckinRememberQuery(token);

    console.log("checkin Remember", proposals);

    // * Cadastrar todas as propostas encontradas na tabela de notificações
    await Promise.all(
      proposals.map(async (proposal) => {
        return await Promise.all([
          // * Notificação de liberação de checkin
          await newNotification(token, {
            TITLE: "Como foi o show? Avalie os shows que terminaram há pouco!",
            BODY: `${proposal.CASA} às ${moment(proposal.DATA_INICIO).format(
              "HH:mm"
            )}`,
            DESCRIPTION: "Isso contribui muito para a carreira do artista!",
            FK_PROPOSTA: proposal.ID,
            FK_USER: proposal.FK_USUARIO,
            NOTIFICATION_READ: true,
            START_TASK: moment(proposal.DATA_INICIO).format("YYYY-MM-DDTHH:mm"),
            END_TASK: moment(proposal.DATA_INICIO).format("YYYY-MM-DDTHH:mm"),
            APP_ARTISTAS_NEW: true,
            TIPO: "REMEMBER",
          }),
        ]);
      })
    );
  } catch (err) {
    // ! Depois fazer um sistema de envio de notificação para alertar quando falhar a rotina (telegram)
    console.log(err.message);
  }
};

export const checkInReminder = async () => {
  try {
    // * Pegar o token para fazer as requisições
    const token = await login("notificacao@eshows.com.br", "140414");

    // * Pegar todas as propostas que ainda não passaram e não foram notificadas
    const proposals = await getCheckinQuery(token);

    console.log("checkin", proposals);

    // * Cadastrar todas as propostas encontradas na tabela de notificações
    await Promise.all(
      proposals.map(async (proposal) => {
        return await Promise.all([
          // * Notificação de liberação de checkin
          await newNotification(token, {
            TITLE: "O check-in ainda não foi realizado pelo artista e você pode realizá-lo em breve.",
            BODY: `${proposal.CASA} às ${moment(proposal.DATA_INICIO).format(
              "HH:mm"
            )}`,
            DESCRIPTION: "Faça o check-in pelo artista ou notifique a Eshows em caso de problemas!",
            FK_PROPOSTA: proposal.ID,
            FK_USER: proposal.FK_USUARIO,
            NOTIFICATION_READ: true,
            START_TASK: moment(proposal.DATA_INICIO).format("YYYY-MM-DDTHH:mm"),
            END_TASK: moment(proposal.DATA_INICIO).format("YYYY-MM-DDTHH:mm"),
            APP_EMPRESAS_NEW: true,
            TIPO: "CHECKIN",
          }),
        ]);
      })
    );
  } catch (err) {
    console.log(err.message);
  }
};

export const proposalRefused = async () => {
  try {
    // * Pegar o token para fazer as requisições
    const token = await login("notificacao@eshows.com.br", "140414");

    // * Pegar todas as propostas que ainda não passaram e não foram notificadas
    const proposalRefused = await getProposalRefuseds(token);

    await Promise.all(
      proposalRefused.map(async (proposal) => {
        return await Promise.all([
          // * Notificação de reconfirmação da tarde 14h
          await newNotification(token, {
            TITLE: "Confirme presença no seu show amanhã",
            BODY: `${moment(proposal.DATA_INICIO).format("DD/MM")} às ${moment(proposal.DATA_INICIO).format("HH:mm")} - ${proposal.CASA}`,
            DESCRIPTION: "Notificação de reconfirmação de presença",
            FK_PROPOSTA: proposal.ID,
            FK_USER: proposal.FK_USUARIO,
            NOTIFICATION_READ: true,
            START_TASK: moment(proposal.DATA_INICIO).format("YYYY-MM-DDTHH:mm"),
            END_TASK: moment(proposal.DATA_INICIO).format("YYYY-MM-DDTHH:mm"),
            APP_ARTISTAS_NEW: true,
            TIPO: "REFUSED",
          }),
        ]);
      })
    );
  } catch (err) {
    // ! Depois fazer um sistema de envio de notificação para alertar quando falhar a rotina (telegram)
    console.log(err.message);
  }
};

export const warningWeekly = async () => {
  try {
    // * Pegar o token para fazer as requisições
    const token = await login("notificacao@eshows.com.br", "140414");

    // * Pegar todas as propostas que ainda não passaram e não foram notificadas
    const warnigWeekly = await getOrganizeWeekly(token);

    await Promise.all(
      warnigWeekly.map(async (proposal) => {
        return await Promise.all([
          // * Notificação de reconfirmação do dia 09h
          await newNotification(token, {
            TITLE: "Semana começando!",
            BODY: `${moment(proposal.DATA_INICIO).format("DD/MM")} às ${moment(proposal.DATA_INICIO).format("HH:mm")} - ${proposal.CASA}`,
            DESCRIPTION: "Lembre de verificar e validar os artistas e os horários.",
            FK_PROPOSTA: proposal.ID,
            FK_USER: proposal.FK_USUARIO,
            NOTIFICATION_READ: true,
            START_TASK: moment(proposal.DATA_INICIO).format("YYYY-MM-DDTHH:mm"),
            END_TASK: moment(proposal.DATA_INICIO).format("YYYY-MM-DDTHH:mm"),
            APP_ARTISTAS_NEW: true,
            TIPO: "WARNINGKEEKLY",
          }),
        ]);
      })
    );
  } catch (err) {
    console.log(err.message);
  }
};

export const warningWeekendCalendar = async () => {
  try {
    // * Pegar o token para fazer as requisições
    const token = await login("notificacao@eshows.com.br", "140414");

    // * Pegar todas as propostas que ainda não passaram e não foram notificadas
    const weekendCalendar = await getWeekendCalendar(token);

    await Promise.all(
      weekendCalendar.map(async (proposal) => {
        return await Promise.all([
          // * Notificação de liberação de checkout
          await newNotification(token, {
            TITLE: "Final de semana chegando!",
            BODY: `${proposal.CASA} às ${moment(proposal.DATA_FIM).format(
              "HH:mm"
            )}`,
            DESCRIPTION: "Lembre de verificar e validar os artistas e os horários.",
            FK_PROPOSTA: proposal.ID,
            FK_USER: proposal.FK_USUARIO,
            NOTIFICATION_READ: 0,
            START_TASK: moment(proposal.DATA_FIM).format("YYYY-MM-DDTHH:mm"),
            END_TASK: moment(proposal.DATA_FIM).format("YYYY-MM-DDTHH:mm"),
            APP_ARTISTAS_NEW: true,
            TIPO: "WARNINGWEEKEND",
          }),
        ]);
      })
    );
  } catch (err) {
    console.log(err.message);
  }
};

export const callRoutinesCheckInReminder = async () => {
  await checkInReminder();
};

export const callRoutinesReviewReminder = async () => {
  await reviewReminder();
};

export const callRoutinesProposalRefused = async () => {
  await proposalRefused();
};

export const callRoutinesWarningWeekly = async () => {
  await warningWeekly();
};

export const callRoutinesWarningWeekendCalendar = async () => {
  await warningWeekendCalendar();
};

export const sendNotificationsRoutine = async () => {
  await sendNotifications();
};