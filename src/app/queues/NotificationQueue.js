import redisConfig from '../../config/redis';

export default {
  name: 'NotificationQueue',
  options: {
    redis: redisConfig,
  }
}
