import { api } from "./api";

// Lembrete de check-in
export const getCheckinQuery = async (token) => {
  const { data } = await api.post(
    "/Integration/Query",
    {
      qid: "APP_EMPRESAS:GET_CHECK-IN-REMINDER",
    },
    {
      headers: {
        Accept: "application/json",
        auth: token,
      },
    }
  );

  return data.list || [];
};

// Lembrete de avaliação
export const getReviewReminder = async (token) => {
  const { data } = await api.post(
    "/Integration/Query",
    {
      qid: "APP_EMPRESAS:GET_REVIEW_REMINDER",
    },
    {
      headers: {
        Accept: "application/json",
        auth: token,
      },
    }
  );

  return data.list || [];
};

// Aviso de agenda de fim de semana
export const getWarningWeekendCalendar = async (token) => {
  const { data } = await api.post(
    "/Integration/Query",
    {
      qid: "APP_EMPRESAS:GET_WEEKEND_CALENDAR",
    },
    {
      headers: {
        Accept: "application/json",
        auth: token,
      },
    }
  );

  return data.list || [];
};

// Aviso de agenda semanal
export const getWarningWeekly = async (token) => {
  console.log("token", token);
  const { data } = await api.post(
    "/Integration/Query",
    {
      qid: "APP_EMPRESAS:GET_WEEKLY_NOTICE",
    },
    {
      headers: {
        Accept: "application/json",
        auth: token,
      },
    }
  );

  return data.list || [];
};

// Proposta recusada
export const getProposalRefused = async (token) => {
  const { data } = await api.post(
    "/Integration/Query",
    {
      qid: "APP_EMPRESAS:GET_PROPOSAL_REFUSED",
    },
    {
      headers: {
        Accept: "application/json",
        auth: token,
      },
    }
  );

  return data.list || [];
};

export const updateProposal = async (token, data, proposalId) => {
  return await api.post(
    "/Integration/Save",
    {
      tid: "VF9QUk9QT1NUQVM6MDg5NDY2",
      fid: 109,
      type: 1,
      key: {
        id: proposalId,
      },
      data,
    },
    {
      headers: {
        Accept: "application/json",
        auth: token,
      },
    }
  );
};
