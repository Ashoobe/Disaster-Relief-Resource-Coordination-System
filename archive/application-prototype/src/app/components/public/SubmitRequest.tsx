import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, ArrowLeft, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

export function SubmitRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    disasterType: '',
    category: '',
    priority: '',
    description: '',
    address: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.createRequest({
        disasterType: formData.disasterType as any,
        category: formData.category as any,
        priority: formData.priority as any,
        status: 'pending',
        location: {
          address: formData.address
        },
        description: formData.description,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone
      });

      toast.success('Emergency request submitted successfully! Our team will contact you shortly.');
      navigate('/');
    } catch (error) {
      console.error('Failed to submit request:', error);
      toast.error('Failed to submit request. Please try again or call our hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Emergency Banner */}
        <div className="bg-red-600 text-white rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="size-8 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Emergency Request Form</h2>
              <p className="text-red-100 mb-4">
                If this is a life-threatening emergency, please call 911 immediately. 
                For disaster relief assistance, complete this form and our team will respond as quickly as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:911"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 rounded-md font-medium hover:bg-red-50 transition-colors"
                >
                  <Phone className="size-4" />
                  Call 911
                </a>
                <a
                  href="tel:1-800-DISASTER"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-transparent border-2 border-white text-white rounded-md font-medium hover:bg-white/10 transition-colors"
                >
                  <Phone className="size-4" />
                  Call 1-800-DISASTER
                </a>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Emergency Request</CardTitle>
            <CardDescription>
              Fill out the form below with as much detail as possible. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Emergency Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Emergency Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="disasterType">Type of Disaster *</Label>
                    <Select
                      value={formData.disasterType}
                      onValueChange={(value) => handleSelectChange('disasterType', value)}
                      required
                    >
                      <SelectTrigger id="disasterType" className="mt-1">
                        <SelectValue placeholder="Select disaster type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="earthquake">Earthquake</SelectItem>
                        <SelectItem value="hurricane">Hurricane</SelectItem>
                        <SelectItem value="wildfire">Wildfire</SelectItem>
                        <SelectItem value="tornado">Tornado</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Type of Assistance Needed *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                      required
                    >
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Select assistance type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rescue">Search & Rescue</SelectItem>
                        <SelectItem value="medical">Medical Aid</SelectItem>
                        <SelectItem value="shelter">Shelter/Housing</SelectItem>
                        <SelectItem value="food">Food & Water</SelectItem>
                        <SelectItem value="evacuation">Evacuation</SelectItem>
                        <SelectItem value="supplies">Relief Supplies</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority">Urgency Level *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange('priority', value)}
                    required
                  >
                    <SelectTrigger id="priority" className="mt-1">
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical - Immediate Life Threat</SelectItem>
                      <SelectItem value="high">High - Urgent Assistance Needed</SelectItem>
                      <SelectItem value="medium">Medium - Assistance Needed Soon</SelectItem>
                      <SelectItem value="low">Low - Non-Urgent Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Please provide detailed information about the emergency situation, number of people affected, any injuries, specific needs, etc."
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include as much detail as possible to help us respond effectively
                  </p>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
                
                <div>
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Main Street, City, State, ZIP"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide the exact location where assistance is needed
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      name="contactName"
                      type="text"
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="contactEmail">Email Address (Optional)</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What happens next:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>1. Your request will be reviewed immediately by our emergency response team</li>
                  <li>2. We will contact you at the phone number provided to confirm details</li>
                  <li>3. Based on urgency, resources will be dispatched to your location</li>
                  <li>4. You will receive updates on the status of your request</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1">
                  <AlertCircle className="size-5 mr-2" />
                  {isSubmitting ? 'Submitting Request...' : 'Submit Emergency Request'}
                </Button>
                <Button asChild type="button" variant="outline" size="lg">
                  <Link to="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Having trouble with the form? Contact us directly:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:1-800-DISASTER"
              className="inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <Phone className="size-4" />
              1-800-DISASTER
            </a>
            <span className="hidden sm:block text-gray-400">•</span>
            <a
              href="mailto:help@disasteraid.org"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              help@disasteraid.org
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
