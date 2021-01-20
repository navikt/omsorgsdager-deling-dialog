import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import InfoDialog from '@navikt/sif-common-core/lib/components/dialogs/info-dialog/InfoDialog';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { validateSamtykke } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import SoknadFormComponents from '../../soknad/SoknadFormComponents';
import { SoknadFormField } from '../../types/SoknadFormData';
import DinePlikterContent from './dine-plikter/DinePlikter';
import BehandlingAvPersonopplysningerContent from './personopplysninger/Personopplysninger';
import { NavFrontendSkjemaFeil } from '@navikt/sif-common-core/lib/types/NavFrontendSkjemaFeil';

interface DialogState {
    dinePlikterModalOpen?: boolean;
    behandlingAvPersonopplysningerModalOpen?: boolean;
}

interface Props {
    onStart: () => void;
}

const VelkommenPageForm: React.FunctionComponent<Props> = ({ onStart }) => {
    const [dialogState, setDialogState] = useState<DialogState>({});
    const { dinePlikterModalOpen, behandlingAvPersonopplysningerModalOpen } = dialogState;
    const intl = useIntl();

    return (
        <SoknadFormComponents.Form
            onValidSubmit={onStart}
            includeButtons={false}
            fieldErrorRenderer={(error): NavFrontendSkjemaFeil => commonFieldErrorRenderer(intl, error)}>
            <FormBlock>
                <SoknadFormComponents.ConfirmationCheckbox
                    label={intlHelper(intl, 'samtykke.tekst')}
                    name={SoknadFormField.harForståttRettigheterOgPlikter}
                    validate={validateSamtykke}>
                    <FormattedMessage
                        id="samtykke.harForståttLabel"
                        values={{
                            plikterLink: (
                                <Lenke href="#" onClick={(): void => setDialogState({ dinePlikterModalOpen: true })}>
                                    {intlHelper(intl, 'samtykke.harForståttLabel.lenketekst')}
                                </Lenke>
                            ),
                        }}
                    />
                </SoknadFormComponents.ConfirmationCheckbox>
                <Box textAlignCenter={true} margin="xl">
                    <Hovedknapp>{intlHelper(intl, 'step.velkommen.button.start')}</Hovedknapp>
                    <FormBlock>
                        <Lenke
                            href="#"
                            onClick={(): void => setDialogState({ behandlingAvPersonopplysningerModalOpen: true })}>
                            <FormattedMessage id="step.velkommen.personopplysninger.lenketekst" />
                        </Lenke>
                    </FormBlock>
                </Box>
            </FormBlock>

            <InfoDialog
                contentLabel={intlHelper(intl, 'modal.dinePlikter.dialog.tittel')}
                isOpen={dinePlikterModalOpen === true}
                onRequestClose={(): void => setDialogState({ dinePlikterModalOpen: false })}>
                <DinePlikterContent />
            </InfoDialog>

            <InfoDialog
                isOpen={behandlingAvPersonopplysningerModalOpen === true}
                onRequestClose={(): void => setDialogState({ behandlingAvPersonopplysningerModalOpen: false })}
                contentLabel={intlHelper(intl, 'modal.personopplysninger.dialog.tittel')}>
                <BehandlingAvPersonopplysningerContent />
            </InfoDialog>
        </SoknadFormComponents.Form>
    );
};

export default VelkommenPageForm;
