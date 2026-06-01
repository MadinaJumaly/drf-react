from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Client
from .serializers import ClientSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['POST'])

@permission_classes([AllowAny])

def register(request):

    username = request.data.get('username')

    if User.objects.filter(username=username).exists():

        return Response(

            {'error': 'Username already exists'},

            status=status.HTTP_400_BAD_REQUEST,

        )

    user = User.objects.create_user(

        username=username,

        password=request.data.get('password'),

    )

    Client.objects.create(

        user=user,

        name=request.data.get('name'),

        email=request.data.get('email'),

        phone=request.data.get('phone'),

        address=request.data.get('address'),

    )

    token, _ = Token.objects.get_or_create(user=user)

    return Response({

        'token': token.key,

        'username': user.username,

    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username})


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def client(request):
    client_obj, _ = Client.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = ClientSerializer(client_obj)
        return Response(serializer.data)

    partial = request.method == 'PATCH'
    serializer = ClientSerializer(client_obj, data=request.data, partial=partial)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)