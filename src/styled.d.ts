import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        primaryColor: string;
        secondaryColor: string;
        textColor: string;
        backgroundColor: string;
        headingFont: string;
        bodyFont: string;
    }
}
