// useLocationFormHandlers.js
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { cities, state } from '../../redux/Global Slice/cscSlice';

export const useLocationFormHandlers = (setFormData, formData, setLoading, setErrors) => {
    const dispatch = useDispatch();

    const handleLocationSelectChange = async (field, selectedOption) => {
        if (field === 'country') {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    country: {
                        name: selectedOption?.label,
                        dial_code: selectedOption?.dial_code,
                        short_name: selectedOption?.short_name,
                        emoji: selectedOption?.emoji,
                    },
                    state: null,
                    city: null
                }
            }));
            // setErrors({})

            if (selectedOption?.short_name) {
                try {
                    setLoading(true);
                    await dispatch(state({ country_code: selectedOption.short_name }));
                } catch (error) {
                    toast.error('Failed to fetch states');
                } finally {
                    setLoading(false);
                }
            }

        } else if (field === 'state') {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    state: {
                        name: selectedOption?.label,
                        code: selectedOption?.code,
                    },
                    city: null
                }
            }));

            // console.log("dial_code", selectedOption)
            // setErrors({})


            try {
                setLoading(true);
                await dispatch(cities({
                    country_code: selectedOption.country_code,
                    state_code: selectedOption.state_code
                }));
            } catch (error) {
                toast.error('Failed to fetch cities');
            } finally {
                setLoading(false);
            }


        } else if (field === 'city') {

            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    city: {
                        name: selectedOption?.label,
                    }
                }
            }));
            // setErrors({})

        }
    };

    return { handleLocationSelectChange };
};