import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveyRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import { resolve } from 'path';
import { AppError } from '../Errors/AppError';

class SendMailController {

  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);


    const user = await usersRepository.findOne({ email });

    if (!user) {
      throw new AppError('User does not exists!');
    }

    const survey = await surveysRepository.findOne({ id: survey_id })

    if (!survey) {
      throw new AppError('Survey does not exists!');
    }

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ["user", "survey"]
    });

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')
    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL
    }


    if (surveyUserExists) {
      variables.id = surveyUserExists.id;

      await SendMailService.execute(email, survey.title, variables, npsPath)
      return response.json(surveyUserExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id.toString(),
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);
    variables.id = surveyUser.id;
    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser);

  }
}

export { SendMailController }