import { AxiosError } from "axios";

export const _errorForgotPass = (error: string) => {
    switch (error) {

        case 'validation.exists': return "Ce compte n'existe pas, vérifiez votre email";
        
        case 'passwords.token': return "Token déjà utilisé ou expiré. Cliquez de nouveau sur 'mot de passe oublié'.";
       
        
        
        default:
          return "Une erreur est survenue, réessayez";
      }
}


export const _errorAxiosPatern = (error: unknown, messageError: string) => {
    if (error instanceof AxiosError) {
        const errorResponse = error.response?.data;
        try {
          const parsedError = error?.request?.response ? JSON.parse(error.request.response) : null;
          messageError = parsedError?.data?.id_company || errorResponse?.message || messageError;
        } catch (parseError) {
          messageError = errorResponse?.message || error.message || messageError;
        }
           return messageError
       
      }
}