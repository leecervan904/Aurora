import isString from 'lodash/isString'
import type {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import {
  Catch,
  HttpStatus,
} from '@nestjs/common'
import type {
  ExceptionInfo,
  HttpResponseError,
} from '@app/interfaces/response.interface'
import {
  ResponseStatus,
} from '@app/interfaces/response.interface'
import { UNDEFINED } from '@app/constants/value.constant'
import { isDevEnv } from '@app/app.environment'

/**
 * @class HttpExceptionFilter
 * @classdesc catch globally exceptions & formatting error message to <HttpErrorResponse>
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest()
    const response = host.switchToHttp().getResponse()
    console.log('12344555', request.query, request.body)
    const exceptionStatus
      = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR
    const errorResponse: ExceptionInfo
      = exception.getResponse() as ExceptionInfo
    const errorMessage
      = typeof errorResponse === 'string' ? errorResponse : errorResponse.message
    const errorInfo
      = typeof errorResponse === 'string' ? null : errorResponse.error

    const data: HttpResponseError = {
      status: ResponseStatus.Error,
      message: errorMessage,
      error:
        errorInfo?.message
        || (isString(errorInfo) ? errorInfo : JSON.stringify(errorInfo)),
      debug: isDevEnv ? errorInfo?.stack || exception.stack : UNDEFINED,
    }

    // default 404
    if (exceptionStatus === HttpStatus.NOT_FOUND) {
      data.error = data.error || 'Not found'
      data.message
        = data.message || `Invalid API: ${request.method} > ${request.url}`
    }

    return response.status(errorInfo?.status || exceptionStatus).jsonp(data)
  }
}
