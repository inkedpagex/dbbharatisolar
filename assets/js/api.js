/**
 * DB Bharati Solar - API Helpers
 */
const API = {

    /**
     * Build URL with properly URL-encoded key (fixes # and @ in key)
     */
    _buildUrl(action, withKey = false) {
        const base = window.CONFIG.APPS_SCRIPT_URL;
        if (withKey) {
            const key = encodeURIComponent(window.CONFIG.APPS_SCRIPT_KEY);
            return `${base}?action=${action}&key=${key}`;
        }
        return `${base}?action=${action}`;
    },

    /**
     * Fetch all works from Google Sheets
     */
    async getWorks() {
        try {
            const url = this._buildUrl('works_list');
            const response = await fetch(url);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching works:', error);
            return { success: false, message: 'Failed to connect to backend' };
        }
    },

    /**
     * Add a new work entry to Google Sheets
     */
    async addWork(workData) {
        try {
            const url = this._buildUrl('works_add', true);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(workData)
            });
            const text = await response.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                return { success: true, message: 'Success (Implicit)' };
            }
        } catch (error) {
            console.error('Work API Error:', error);
            return { success: false, message: 'Database Sync Failed' };
        }
    },

    /**
     * Delete work by ID
     */
    async deleteWorkById(id) {
        try {
            const url = this._buildUrl('works_delete', true);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ id })
            });
            const text = await response.text();
            return JSON.parse(text);
        } catch (error) {
            console.error('Delete API Error:', error);
            return { success: false, message: 'Deletion Failed' };
        }
    },

    /**
     * Add a lead from contact form
     */
    async addLead(leadData) {
        try {
            const url = this._buildUrl('leads_add', true);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(leadData),
                redirect: 'follow'
            });

            const text = await response.text();
            console.log('[DB Solar] Lead API response:', text);

            try {
                return JSON.parse(text);
            } catch (e) {
                if (text.toLowerCase().includes('success')) {
                    return { success: true, message: 'Inquiry Sent Successfully!' };
                }
                return { success: false, message: 'Unexpected server response. Please try WhatsApp.' };
            }
        } catch (error) {
            console.error('[DB Solar] Lead network error:', error);
            return { success: false, message: 'Network error. Please use WhatsApp.' };
        }
    },

    /**
     * Upload image to ImgBB
     */
    async uploadToImgBB(file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${window.CONFIG.IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                return {
                    success: true,
                    imageUrl: result.data.url,
                    thumbUrl: result.data.thumb.url,
                    deleteUrl: result.data.delete_url
                };
            }
            return { success: false, message: result.error.message };
        } catch (error) {
            console.error('ImgBB upload error:', error);
            return { success: false, message: 'Upload failed' };
        }
    }
};

window.API = API;
