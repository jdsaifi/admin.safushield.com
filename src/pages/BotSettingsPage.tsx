import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Input, Panel, Form } from 'rsuite';
import Sidebar from '../components/Sidebar';
import api from '../lib/axios';
import { useForm, Controller } from 'react-hook-form';
import { BotSettings } from '../types/botSettings';
import { toast } from 'sonner';

const Textarea = React.forwardRef<HTMLTextAreaElement>((props, ref) => (
    <Input
        {...props}
        as="textarea"
        ref={ref}
        className="w-full"
        rows={7}
        style={{ width: '100%' }}
    />
));

interface IFormInput {
    banned_words: string;
}

const BotSettingsPage = () => {
    const { data: botSettingsData, isSuccess } = useQuery({
        queryKey: ['groups'],
        queryFn: async () => {
            const response = await api.get('/v1/admin/bot-settings');
            return response.data.data[0] as BotSettings;
        },
    });

    const updateBotSettingsMutation = useMutation({
        mutationFn: async (data) => {
            return api.post('/v1/admin/bot-settings', data);
        },
        onSuccess: () => toast.success('Bot settings updated successfully'),
    });

    const { control, handleSubmit, setValue } = useForm<IFormInput>({
        defaultValues: { banned_words: '' },
    });
    const onSubmit = (data: any) => updateBotSettingsMutation.mutate(data);

    useEffect(() => {
        if (isSuccess) {
            const bannedWords = botSettingsData?.banned_words
                ? botSettingsData?.banned_words.join(',')
                : '';
            setValue('banned_words', bannedWords);
        }
    }, [isSuccess, botSettingsData, setValue]);

    return (
        <div className="flex h-screen">
            <Sidebar activeKey="5" onSelect={() => {}} />

            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Bot Settings
                            </h1>
                            <p className="text-gray-600">
                                Manage bot's global settings
                            </p>
                        </div>
                    </div>

                    <Panel bordered>
                        <Form onSubmit={handleSubmit(onSubmit)} fluid>
                            {/* banned words list */}
                            <Controller
                                name="banned_words"
                                control={control}
                                render={({ field }) => (
                                    <Form.Group>
                                        <Form.ControlLabel className="font-semibold">
                                            Banned words list
                                        </Form.ControlLabel>

                                        <Form.Control
                                            id={field.name}
                                            value={field.value}
                                            accepter={Textarea}
                                            onChange={(value) =>
                                                field.onChange(value)
                                            }
                                            name="banned_words"
                                        />
                                    </Form.Group>
                                )}
                            />
                            {/* end */}

                            <Button appearance="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default BotSettingsPage;
